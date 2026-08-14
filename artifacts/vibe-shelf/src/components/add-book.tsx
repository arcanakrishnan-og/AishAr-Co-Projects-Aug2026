import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateBook } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBooksQueryKey, getGetShelfStatsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { LibraryBig, Loader2 } from "lucide-react";

const addBookSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  projectName: z.string().min(1, "Project name is required"),
  githubLink: z.string().url("Must be a valid URL").min(1, "GitHub link is required"),
  liveLink: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.undefined()]),
  email: z.union([z.string().email("Must be a valid email"), z.literal(""), z.undefined()]),
});

type AddBookValues = z.infer<typeof addBookSchema>;

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createBook = useCreateBook();

  const form = useForm<AddBookValues>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      projectName: "",
      githubLink: "",
      liveLink: "",
      email: "",
    },
  });

  const onSubmit = (data: AddBookValues) => {
    // Convert empty strings to undefined to match API optional fields
    const payload = {
      ...data,
      liveLink: data.liveLink || undefined,
      email: data.email || undefined,
    };

    createBook.mutate(
      { data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetShelfStatsQueryKey() });
          toast({
            title: "Book placed on shelf",
            description: "Your project has been successfully added to the library.",
          });
          form.reset();
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not add your book. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px] parchment-texture border-amber-900/20 shadow-2xl bg-card text-card-foreground">
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-amber-900/10 rounded-full flex items-center justify-center mb-4 text-amber-900">
            <LibraryBig size={24} />
          </div>
          <DialogTitle className="text-2xl font-serif text-center text-amber-950">
            Add Your Book
          </DialogTitle>
          <DialogDescription className="text-center font-sans text-amber-900/70">
            Immortalise your vibe-coded project on the library shelves.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-950">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ada" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-950">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lovelace" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Analytical Engine" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-950">Collaboration Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ada@example.com" type="email" className="bg-white/50 border-amber-900/20 focus-visible:ring-amber-900/50" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full font-serif text-lg tracking-wide bg-amber-800 hover:bg-amber-900 text-white"
                disabled={createBook.isPending}
              >
                {createBook.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shelving...
                  </>
                ) : (
                  "Place on Shelf"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}